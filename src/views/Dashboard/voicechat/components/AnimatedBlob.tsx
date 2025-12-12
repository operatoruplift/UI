import React from 'react'
import { motion } from 'motion/react'
import { WavyBackground } from '@/components/ui/wavy-background'

interface AnimatedBlobProps {
  isSpeaking: boolean
  audioLevel: number
}

export const AnimatedBlob: React.FC<AnimatedBlobProps> = ({ isSpeaking, audioLevel }) => {
  return (
    <WavyBackground waveWidth={10} blur={0}>
    </WavyBackground>
  )
}

