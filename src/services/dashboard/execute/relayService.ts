export interface RelayMessage {
  action?: string;
  id?: string;
  device_id?: string;
  auth_token?: string;
  [key: string]: any;
}

export interface RelayResponse {
  action?: string;
  data?: {
    tool_id?: string;
    user_intent?: string;
  };
  request_id?: string;
  target_id?: string;
  type?: string;
  error?: string;
}

type RelayStatus = 'Disconnected' | 'Connected' | 'Connecting' | 'Error';

type MessageHandler = (data: RelayResponse) => void;
type StatusHandler = (status: RelayStatus) => void;
type ErrorHandler = (error: Event) => void;

class RelayService {
  private ws: WebSocket | null = null;
  private status: RelayStatus = 'Disconnected';
  private wsUrl: string | null = null;
  private deviceId: string | null = null;
  private authToken: string | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly baseDelay = 1000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingTimer: NodeJS.Timeout | null = null;
  private lastPong = 0;

  private messageHandlers = new Set<MessageHandler>();
  private statusHandlers = new Set<StatusHandler>();
  private errorHandlers = new Set<ErrorHandler>();

  private shouldReconnect = true;
  private isManualDisconnect = false;

  private async getWsUrl(): Promise<string> {
    try {
      const url = await window.electronAPI?.getEnv('RELAY_WS_URL');
      return url || '';
    } catch {
      return '';
    }
  }

  setAuth(deviceId: string, authToken: string) {
    this.deviceId = deviceId;
    this.authToken = authToken;
  }

  async connect(deviceId?: string, authToken?: string) {
    if (deviceId) this.deviceId = deviceId;
    if (authToken) this.authToken = authToken;
    if (!this.deviceId || !this.authToken) return;

    if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) return;

    this.setStatus('Connecting');
    this.reconnectAttempts = 0;
    this.isManualDisconnect = false;

    try {
      this.wsUrl = this.wsUrl || (await this.getWsUrl());
      if (!this.wsUrl) throw new Error('Missing RELAY_WS_URL');

      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        this.setStatus('Connected');
        this.reconnectAttempts = 0;
        this.lastPong = Date.now();

        this.sendMessage({
          device_id: this.deviceId!,
          auth_token: this.authToken!,
        });

        this.startPing();
      };

      this.ws.onmessage = (event) => this.handleMessage(event);
      this.ws.onclose = () => this.handleClose();
      this.ws.onerror = (err) => this.handleError(err);
    } catch {
      this.setStatus('Error');
    }
  }

  disconnect() {
    this.isManualDisconnect = true;
    this.shouldReconnect = false;
    this.stopPing();

    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }

    this.setStatus('Disconnected');
  }

  private startPing() {
    this.stopPing();
    this.pingTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ action: 'ping', device_id: this.deviceId }));
      }
    }, 30000);
  }

  private stopPing() {
    if (this.pingTimer) clearInterval(this.pingTimer);
    this.pingTimer = null;
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data: RelayResponse = JSON.parse(event.data);
      const isIntent =
        data.type === 'intent' || data.data?.tool_id || data.data?.user_intent;

      if (isIntent && (!data.target_id || data.target_id === this.deviceId)) {

        this.processIntentAsync(data);
        return;
      }

      this.messageHandlers.forEach((fn) => fn(data));
    } catch {
      // Ignore invalid messages
    }
  }


  private async processIntentAsync(data: RelayResponse) {
    try {
      const { processToolCall } = await import('./toolCallService');
      // Wait for the tool call to complete
      await processToolCall(data);
      console.log('Tool call completed');
    } catch (error) {
      console.error('Tool call error:', error);
    }
  }

  private handleClose() {
    this.setStatus('Disconnected');
    this.stopPing();

    if (!this.shouldReconnect || this.isManualDisconnect) return;

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.baseDelay * Math.pow(2, this.reconnectAttempts++);
      this.reconnectTimer = setTimeout(() => this.connect(), delay);
    } else {
      this.setStatus('Error');
    }
  }

  private handleError(err: Event) {
    this.setStatus('Error');
    this.errorHandlers.forEach((fn) => fn(err));
  }

  sendAction(action: string, id?: string, extra?: Record<string, any>) {
    return this.sendMessage({ action, id: id || Date.now().toString(), ...extra });
  }

  sendMessage(msg: RelayMessage): boolean {
    if (this.ws?.readyState !== WebSocket.OPEN) return false;
    try {
      this.ws.send(JSON.stringify(msg));
      return true;
    } catch {
      return false;
    }
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onStatusChange(handler: StatusHandler) {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }

  onError(handler: ErrorHandler) {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  getStatus() {
    return this.status;
  }

  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private setStatus(status: RelayStatus) {
    this.status = status;
    this.statusHandlers.forEach((fn) => fn(status));
  }
}

// Singleton instance
export const relayService = new RelayService();

// Convenience exports
export const connectRelay = (deviceId: string, authToken: string) =>
  relayService.connect(deviceId, authToken);
export const disconnectRelay = () => relayService.disconnect();
export const sendRelayAction = (action: string, id?: string, extra?: Record<string, any>) =>
  relayService.sendAction(action, id, extra);
export const sendRelayMessage = (msg: RelayMessage) => relayService.sendMessage(msg);
export const getRelayStatus = () => relayService.getStatus();
export const isRelayConnected = () => relayService.isConnected();
