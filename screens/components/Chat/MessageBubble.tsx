import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Box } from "@/components/ui/box";
import { Text as GluestackText } from "@/components/ui/text";
import { User } from 'lucide-react-native';

interface MessageBubbleProps {
    message: string;
    timestamp: string;
    isOutgoing: boolean;
    username?: string;
    avatar?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    timestamp,
    isOutgoing,
    username,
    avatar,
}) => {
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString([], { 
                month: 'short', 
                day: 'numeric' 
            });
        }
    };

    return (
        <Box className={`flex-row items-end space-x-2 ${isOutgoing ? 'justify-end' : 'justify-start'} mb-3 px-4`}>
            {!isOutgoing && (
                <Box className="relative">
                    <Box className="w-8 h-8 rounded-full bg-indigo-100 items-center justify-center">
                        <User size={16} color="#6366f1" />
                    </Box>
                    <Box className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
                </Box>
            )}
            <Box className={`max-w-[80%] ${isOutgoing ? 'items-end' : 'items-start'}`}>
                {!isOutgoing && username && (
                    <GluestackText className="text-xs text-gray-500 mb-1">{username}</GluestackText>
                )}
                <Box 
                    className={`px-4 py-3 rounded-2xl ${
                        isOutgoing 
                            ? 'bg-blue-500 rounded-tr-none' 
                            : 'bg-gray-100 rounded-tl-none'
                    } shadow-sm`}
                >
                    <GluestackText 
                        className={`text-base ${
                            isOutgoing ? 'text-white' : 'text-gray-800'
                        }`}
                    >
                        {message}
                    </GluestackText>
                    <GluestackText 
                        className={`text-xs mt-1 ${
                            isOutgoing ? 'text-blue-100' : 'text-gray-500'
                        }`}
                    >
                        {formatTimestamp(timestamp)}
                    </GluestackText>
                </Box>
            </Box>
            {isOutgoing && (
                <Box className="relative">
                    <Box className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
                        <User size={16} color="#3b82f6" />
                    </Box>
                    <Box className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
                </Box>
            )}
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 4,
        paddingHorizontal: 16,
        maxWidth: '80%',
    },
    outgoingContainer: {
        alignSelf: 'flex-end',
    },
    incomingContainer: {
        alignSelf: 'flex-start',
    },
    userInfo: {
        marginBottom: 4,
    },
    username: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    bubble: {
        padding: 12,
        paddingBottom: 8,
        borderRadius: 20,
        maxWidth: '100%',
    },
    outgoingBubble: {
        backgroundColor: '#007AFF',
        borderTopRightRadius: 4,
    },
    incomingBubble: {
        backgroundColor: '#F0F0F0',
        borderTopLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    outgoingText: {
        color: '#FFFFFF',
    },
    incomingText: {
        color: '#000000',
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    outgoingTimestamp: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    incomingTimestamp: {
        color: '#666',
    },
}); 