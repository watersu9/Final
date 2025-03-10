import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';

const PostComment = ({ userId, postId }) => {
    const [content, setContent] = useState('');

    const postComment = async () => {
        if (!userId || !postId || !content) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/posts/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    post_id: postId,
                    content: content
                })
            });

            const result = await response.json();

            if (response.status === 201) {
                Alert.alert("Success", "Comment posted successfully.");
                setContent(''); // Clear the input field
            } else {
                Alert.alert("Error", result.message || "Failed to post comment.");
            }
        } catch (error) {
            console.error("Failed to post comment:", error);
            Alert.alert("Error", "Internal server error.");
        }
    };

    return (
        <View>
            <TextInput
                placeholder="Enter your comment"
                value={content}
                onChangeText={setContent}
                style={styles.textInput}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={postComment}
            >
                <Text style={styles.buttonText}>답글</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        padding: 10,
        margin: 10,
        borderRadius: 5 // 모서리를 둥글게 설정
    },
    button: {
        backgroundColor: '#02AE85',
        padding: 10,
        margin: 10,
        alignItems: 'center',
        borderRadius: 5
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    }
});

export default PostComment;
