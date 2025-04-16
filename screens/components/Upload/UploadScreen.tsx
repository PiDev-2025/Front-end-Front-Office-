import React, { useState, useEffect } from 'react';
import { Alert, Platform, ScrollView as RNScrollView, Modal as RNModal, Dimensions } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogBackdrop, AlertDialogContent, AlertDialogBody } from '@/components/ui/alert-dialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAtom } from 'jotai';
import { mediaAtom, MediaItem } from '@/atoms/mediaAtom';
import ApiClient from '@/api-client/api-client/src/apiClient';
import { tokenAtom } from '../../../api-client/api-client/src/storage';

const apiClient = new ApiClient(process.env.API_URL || 'https://noelis.qazar.cloud');

interface CoreLink {
  id: string;
  src: string;
  typ: string;
  name: string;
  status: string;
  owner: string;
  size: number;
}

export const UploadScreen: React.FC = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [media, setMedia] = useAtom(mediaAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    apiClient.initializeTokenAtom([token, setToken]);
    // Load existing media on mount
    loadExistingMedia();
  }, [token, setToken]);

  const loadExistingMedia = async () => {
    try {
      const { links } = await apiClient.listMyLinks();
      
      if (!links || !Array.isArray(links)) {
        setMedia([]);
        return;
      }
      
      const mediaItems: MediaItem[] = links.map((link) => ({
        id: link.id,
        url: link.src,
        type: link.typ.includes('video') ? 'video' : 'image',
        name: link.name,
        fileName: link.name,
      }));
      
      setMedia(mediaItems);
    } catch (error) {
      console.error('Failed to load media:', error);
      Alert.alert('Error', 'Failed to load your media');
    }
  };

  const pickMedia = async () => {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      quality: 1,
      selectionLimit: 1,
    });
    
    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Failed to pick media');
      return;
    }

    if (!result.didCancel && result.assets?.[0]) {
      const asset = result.assets[0];
      handleUpload(asset);
    }
  };

  const handleUpload = async (file: any) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.fileName || 'upload.jpg',
      });

      // Upload using XMLHttpRequest to track progress
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${process.env.API_URL || 'https://noelis.qazar.cloud'}/upload`);
      
      // Add auth token
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText) as { link: CoreLink };
          
          const newMedia: MediaItem = {
            id: response.link.id,
            url: response.link.src,
            type: response.link.typ.includes('video') ? 'video' : 'image',
            name: response.link.name,
            fileName: file.fileName,
          };
          
          setMedia((prev) => [...prev, newMedia]);
          setIsUploading(false);
          setUploadProgress(0);
        } else {
          throw new Error('Upload failed');
        }
      };

      xhr.onerror = () => {
        throw new Error('Upload failed');
      };

      xhr.send(formData);

    } catch (error) {
      console.error('Upload failed:', error);
      Alert.alert('Error', 'Failed to upload media');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      // TODO: Add API endpoint for deletion
      setMedia((prev) => prev.filter((m) => m.id !== itemId));
    } catch (error) {
      console.error('Delete failed:', error);
      Alert.alert('Error', 'Failed to delete media');
    }
  };

  const handleImagePress = (item: MediaItem) => {
    setSelectedImage(item);
    setShowImageModal(true);
  };

  return (
    <Box className="flex-1 bg-background p-4">
      <RNScrollView showsVerticalScrollIndicator={false}>
        <VStack space="md">
          <Card className="p-6 border-2 border-dashed border-primary-500 bg-primary-50">
            <Pressable onPress={pickMedia} disabled={isUploading}>
              <VStack className="items-center space-y-2">
                <MaterialIcons name="cloud-upload" size={32} color="#6366f1" />
                <Text className="text-lg font-bold text-primary-500">
                  {isUploading ? 'Uploading...' : 'Tap to upload media'}
                </Text>
                <Text className="text-sm text-primary-400">
                  Support images and videos
                </Text>
              </VStack>
            </Pressable>
          </Card>

          {isUploading && (
            <Box className="my-4">
              <Box className="w-full h-1 bg-gray-200 rounded-sm overflow-hidden">
                <Box
                  className="h-full bg-primary-500 rounded-sm"
                  style={{ width: `${uploadProgress}%` }}
                />
              </Box>
              <Text className="text-center mt-2">
                {uploadProgress}% uploaded
              </Text>
            </Box>
          )}

          <Text className="text-2xl font-bold mt-4 mb-2">
            Your Media
          </Text>

          <VStack space="md">
            {media.map((item: MediaItem) => (
              <Card
                key={item.id}
                className="bg-white rounded-lg overflow-hidden shadow-md"
              >
                <HStack className="p-3 items-center space-x-3">
                  <Pressable onPress={() => handleImagePress(item)}>
                    <Image
                      source={{ uri: item.url }}
                      alt={item.name}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                      }}
                      resizeMode="cover"
                    />
                  </Pressable>
                  <VStack className="flex-1">
                    <Text className="font-bold">{item.name}</Text>
                    <Text className="text-sm text-gray-500">
                      {item.type}
                    </Text>
                  </VStack>
                  <Pressable
                    onPress={() => handleDelete(item.id)}
                  >
                    <MaterialIcons name="delete-outline" size={24} color="#ef4444" />
                  </Pressable>
                </HStack>
              </Card>
            ))}
          </VStack>
        </VStack>
      </RNScrollView>

      <AlertDialog
        isOpen={showImageModal}
        onClose={() => {
          setShowImageModal(false);
          setSelectedImage(null);
        }}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogBody>
            {selectedImage && (
              <Box className="relative">
                <Image
                  source={{ uri: selectedImage.url }}
                  alt={selectedImage.name}
                  style={{
                    width: windowWidth * 0.9,
                    height: windowHeight * 0.6,
                    borderRadius: 8,
                  }}
                  resizeMode="contain"
                />
                <Pressable
                  onPress={() => {
                    setShowImageModal(false);
                    setSelectedImage(null);
                  }}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1"
                >
                  <MaterialIcons name="close" size={24} color="#ffffff" />
                </Pressable>
              </Box>
            )}
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}; 