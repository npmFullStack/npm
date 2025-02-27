import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    StyleSheet,
    Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const Me = () => {
    const navigation = useNavigation();
    const [userEmail, setUserEmail] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = await AsyncStorage.getItem("userId");
            if (userId) {
                try {
                    const response = await axios.get(
                        `http://127.0.0.1:5000/api/user/${userId}`
                    );
                    setUserEmail(response.data.email);
                    setProfilePic(
                        response.data.profile_pic || "default-pic.png"
                    );
                    setFollowers(response.data.followers || 0);
                    setFollowing(response.data.following || 0);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                    Alert.alert(
                        "Error",
                        "Failed to fetch user data. Please try again."
                    );
                }
            } else {
                Alert.alert("Error", "No user ID found. Please log in again.");
            }
            setIsLoading(false);
        };

        fetchUserData();
    }, []);

    // Function to update profile picture
    const handleEditProfilePic = async () => {
        try {
            // Check and request permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission Denied",
                    "Camera roll access is required to update your profile picture."
                );
                return;
            }

            console.log("Permissions granted. Opening image picker..."); // Debugging log

            // Open the image picker
            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use MediaTypeOptions
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            console.log("Image picker result:", pickerResult); // Debugging log

            if (!pickerResult.canceled) {
                const userId = await AsyncStorage.getItem("userId");

                // Ensure the URI is properly formatted
                let uri = pickerResult.assets[0].uri;
                if (Platform.OS === "android") {
                    uri = uri.replace("file://", "");
                }

                const formData = new FormData();
                formData.append("profile_pic", {
                    uri: uri,
                    name: "profile-pic.jpg",
                    type: "image/jpeg",
                });

                try {
                    const response = await axios.post(
                        `http://127.0.0.1:5000/api/user/${userId}/profile-pic`,
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );

                    if (response.data.profile_pic) {
                        setProfilePic(response.data.profile_pic); // Update the profile picture in the state
                        Alert.alert("Success", "Profile picture updated!");
                    }
                } catch (error) {
                    console.error("Failed to update profile picture:", error);
                    Alert.alert(
                        "Error",
                        "Failed to update profile picture. Please try again."
                    );
                }
            }
        } catch (error) {
            console.error("Error opening image picker:", error);
            Alert.alert(
                "Error",
                "Failed to open the media gallery. Please try again."
            );
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0D47A1" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header with Back Icon */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Dashboard")}
                >
                    <Ionicons
                        name="arrow-back-outline"
                        size={24}
                        color="#fff"
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="settings-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Profile Section */}
            <View style={styles.profileContainer}>
                <View style={styles.profileDetails}>
                    {/* Profile Picture */}
                    <TouchableOpacity
                        onPress={() => {
                            console.log("Profile picture pressed"); // Debugging log
                            handleEditProfilePic();
                        }}
                    >
                        <View style={styles.profilePicContainer}>
                            <Image
                                source={
                                    profilePic === "default-pic.png"
                                        ? require("./assets/default-pic.png")
                                        : { uri: profilePic }
                                }
                                style={styles.profilePic}
                            />
                            <Ionicons
                                name="pencil-outline"
                                size={15}
                                color="#1e88e5"
                                style={styles.editIcon}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Email and Followers/Following */}
                    <View style={styles.userInfo}>
                        <Text style={styles.userEmail}>{userEmail}</Text>
                        <View style={styles.followContainer}>
                            <Text style={styles.followText}>
                                Following: {following}
                            </Text>
                            <Text style={styles.followText}>
                                Followers: {followers}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 30,
        backgroundColor: "#1e88e5",
        padding: 10,
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1e88e5",
        padding: 5,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    profileDetails: {
        flexDirection: "row",
        alignItems: "center",
    },
    profilePicContainer: {
        position: "relative",
        width: 80,
        height: 80,
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "#333",
    },
    editIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#fff",
        padding: 5,
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 50,
        zIndex: 1,
    },
    userInfo: {
        marginLeft: 15,
    },
    userEmail: {
        fontSize: 18,
        fontWeight: "500",
        color: "#fff",
    },
    followContainer: {
        flexDirection: "row",
        marginTop: 5,
    },
    followText: {
        marginRight: 15,
        fontSize: 14,
        color: "#ddd",
    },
});

export default Me;