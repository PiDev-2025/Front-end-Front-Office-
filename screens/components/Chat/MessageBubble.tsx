import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
        <View style={[
            styles.container,
            isOutgoing ? styles.outgoingContainer : styles.incomingContainer
        ]}>
            {!isOutgoing && username && (
                <View style={styles.userInfo}>
                    <Text style={styles.username}>{username}</Text>
                </View>
            )}
            <View style={[
                styles.bubble,
                isOutgoing ? styles.outgoingBubble : styles.incomingBubble
            ]}>
                <Text style={[
                    styles.messageText,
                    isOutgoing ? styles.outgoingText : styles.incomingText
                ]}>
                    {message}
                </Text>
                <Text style={[
                    styles.timestamp,
                    isOutgoing ? styles.outgoingTimestamp : styles.incomingTimestamp
                ]}>
                    {formatTimestamp(timestamp)}
                </Text>
            </View>
        </View>
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