import React from 'react';
import { ScrollView } from 'react-native';
import {
  Box,
  Text,
  VStack,
  HStack,
  Pressable,
} from '@/components/ui';

interface ColorSampleProps {
  colorName: string;
  className: string;
  description: string;
}

function ColorSample({ colorName, className, description }: ColorSampleProps) {
  return (
    <VStack space="xs" className="items-center">
      <Box className={`w-20 h-20 rounded-lg ${className}`} />
      <VStack className="items-center">
        <Text className="text-xs font-medium text-white">{colorName}</Text>
        <Text className="text-2xs text-white/60">{description}</Text>
      </VStack>
    </VStack>
  );
}

export default function ColorPalette() {
  return (
    <Box className="flex-1 bg-background-950">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <VStack space="xl">
          {/* Header */}
          <VStack space="sm" className="items-center">
            <Text className="text-2xl font-bold text-white">
              Custom Color Palette
            </Text>
            <Text className="text-sm text-white/60 text-center">
              All your brand colors available with NativeWind and Gluestack
            </Text>
          </VStack>

          {/* Blues/Cyans Section */}
          <VStack space="md">
            <Text className="text-lg font-semibold text-cyan-primary">
              Blues & Cyans
            </Text>
            <HStack space="md" className="flex-wrap">
              <ColorSample
                colorName="Cyan Primary"
                className="bg-cyan-primary"
                description="bg-cyan-primary"
              />
              <ColorSample
                colorName="Cyan Light"
                className="bg-cyan-light"
                description="bg-cyan-light"
              />
              <ColorSample
                colorName="Blue Primary"
                className="bg-blue-primary"
                description="bg-blue-primary"
              />
              <ColorSample
                colorName="Blue Bright"
                className="bg-blue-bright"
                description="bg-blue-bright"
              />
            </HStack>
          </VStack>

          {/* Pinks/Purples Section */}
          <VStack space="md">
            <Text className="text-lg font-semibold text-pink-primary">
              Pinks & Purples
            </Text>
            <HStack space="md" className="flex-wrap">
              <ColorSample
                colorName="Pink Primary"
                className="bg-pink-primary"
                description="bg-pink-primary"
              />
              <ColorSample
                colorName="Pink Secondary"
                className="bg-pink-secondary"
                description="bg-pink-secondary"
              />
              <ColorSample
                colorName="Purple Primary"
                className="bg-purple-primary"
                description="bg-purple-primary"
              />
              <ColorSample
                colorName="Purple Light"
                className="bg-purple-light"
                description="bg-purple-light"
              />
            </HStack>
          </VStack>

          {/* Yellows/Oranges Section */}
          <VStack space="md">
            <Text className="text-lg font-semibold text-yellow-primary">
              Yellows & Oranges
            </Text>
            <HStack space="md" className="flex-wrap">
              <ColorSample
                colorName="Yellow Primary"
                className="bg-yellow-primary"
                description="bg-yellow-primary"
              />
              <ColorSample
                colorName="Yellow Light"
                className="bg-yellow-light"
                description="bg-yellow-light"
              />
              <ColorSample
                colorName="Orange Primary"
                className="bg-orange-primary"
                description="bg-orange-primary"
              />
            </HStack>
          </VStack>

          {/* Greens Section */}
          <VStack space="md">
            <Text className="text-lg font-semibold text-green-primary">
              Greens
            </Text>
            <HStack space="md" className="flex-wrap">
              <ColorSample
                colorName="Green Primary"
                className="bg-green-primary"
                description="bg-green-primary"
              />
              <ColorSample
                colorName="Green Light"
                className="bg-green-light"
                description="bg-green-light"
              />
              <ColorSample
                colorName="Green Lightest"
                className="bg-green-lightest"
                description="bg-green-lightest"
              />
            </HStack>
          </VStack>

          {/* Usage Examples */}
          <VStack space="md">
            <Text className="text-lg font-semibold text-white">
              Usage Examples
            </Text>
            
            {/* Button Examples */}
            <VStack space="sm">
              <Text className="text-sm text-white/80">Buttons with custom colors:</Text>
              <HStack space="sm" className="flex-wrap">
                <Pressable className="bg-cyan-primary px-4 py-2 rounded-lg">
                  <Text className="text-white font-medium">Cyan Button</Text>
                </Pressable>
                <Pressable className="bg-pink-primary px-4 py-2 rounded-lg">
                  <Text className="text-white font-medium">Pink Button</Text>
                </Pressable>
                <Pressable className="bg-green-primary px-4 py-2 rounded-lg">
                  <Text className="text-white font-medium">Green Button</Text>
                </Pressable>
              </HStack>
            </VStack>

            {/* Text Examples */}
            <VStack space="sm">
              <Text className="text-sm text-white/80">Text with custom colors:</Text>
              <VStack space="xs">
                <Text className="text-cyan-primary text-lg font-semibold">
                  Cyan text (text-cyan-primary)
                </Text>
                <Text className="text-pink-primary text-lg font-semibold">
                  Pink text (text-pink-primary)
                </Text>
                <Text className="text-blue-bright text-lg font-semibold">
                  Blue bright text (text-blue-bright)
                </Text>
                <Text className="text-yellow-primary text-lg font-semibold">
                  Yellow text (text-yellow-primary)
                </Text>
              </VStack>
            </VStack>

            {/* Border Examples */}
            <VStack space="sm">
              <Text className="text-sm text-white/80">Borders with custom colors:</Text>
              <HStack space="sm" className="flex-wrap">
                <Box className="border-2 border-cyan-primary bg-cyan-primary/10 px-3 py-2 rounded-lg">
                  <Text className="text-cyan-primary text-sm">Cyan Border</Text>
                </Box>
                <Box className="border-2 border-pink-primary bg-pink-primary/10 px-3 py-2 rounded-lg">
                  <Text className="text-pink-primary text-sm">Pink Border</Text>
                </Box>
                <Box className="border-2 border-green-primary bg-green-primary/10 px-3 py-2 rounded-lg">
                  <Text className="text-green-primary text-sm">Green Border</Text>
                </Box>
              </HStack>
            </VStack>
          </VStack>

          {/* Code Examples */}
          <VStack space="md">
            <Text className="text-lg font-semibold text-white">
              How to Use
            </Text>
            <VStack space="sm">
              <Box className="bg-secondary-800 p-4 rounded-lg">
                <Text className="text-green-lightest text-xs font-mono">
                  {`// NativeWind Classes\n`}
                  {`<Box className="bg-cyan-primary" />\n`}
                  {`<Text className="text-pink-primary" />\n`}
                  {`<Box className="border-blue-bright" />\n\n`}
                  {`// With opacity\n`}
                  {`<Box className="bg-cyan-primary/20" />\n`}
                  {`<Text className="text-pink-primary/80" />`}
                </Text>
              </Box>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
} 