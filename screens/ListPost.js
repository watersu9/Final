import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Alert, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListPost = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigation = useNavigation();

    const fetchPosts = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await fetch(`http://localhost:3000/api/posts/listPosts?page=${page}&limit=10`, {
                headers: {
                    "Authorization": token
                }
            });
            const result = await response.json();
            if (response.status === 200) {
                setPosts(result.data.posts);
                setTotalPages(result.data.totalPages);
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch posts');
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.postItem}
            onPress={() => navigation.navigate('PostDetail', { ...item })}
        >
            <View style={styles.postContentContainer}>
                <View style={styles.postTextContainer}>
                    <Text style={styles.postTitle}>{item.title}</Text>
                    <Text numberOfLines={1} style={styles.postContent}>{item.content}</Text>
                </View>
                <View style={styles.postLikesContainer}>
                    <Image source={require("../assets/like.png")} style={styles.likeIcon} />
                    <Text style={styles.postLikes}>{item.likes ? item.likes.length : 0}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.outerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
                <Image source={require("../assets/rightarrow-1.png")} style={styles.backIcon} />
            </TouchableOpacity>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>All Posts</Text>
                    <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreatePost')}>
                        <Text style={styles.createButtonText}>Create New Post</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.post_id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
                <View style={styles.pagination}>
                    <TouchableOpacity
                        style={[styles.pageButton, page === 1 && styles.disabledButton]}
                        disabled={page === 1}
                        onPress={() => setPage(page - 1)}
                    >
                        <Text style={styles.pageButtonText}>이전</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.pageButton, page === totalPages && styles.disabledButton]}
                        disabled={page === totalPages}
                        onPress={() => setPage(page + 1)}
                    >
                        <Text style={styles.pageButtonText}>다음</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#D7F2EC',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 10,
        zIndex: 1,
    },
    backIcon: {
        width: 24,
        height: 24,
    },
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 70,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
        left: 140,
    },
    list: {
        paddingBottom: 20,
    },
    postItem: {
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    postContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    postTextContainer: {
        flex: 1,
    },
    postTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333333',
    },
    postContent: {
        fontSize: 10,
        color: '#666666',
    },
    postLikesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    postLikes: {
        fontSize: 12,
        color: '#02AE85',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    pageButton: {
        backgroundColor: '#02AE85',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    disabledButton: {
        backgroundColor: '#02AE85',
        marginBottom:20,
    },
    pageButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    createButton: {
        backgroundColor: '#02AE85',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default ListPost;


