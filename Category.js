import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Category = ({ route, navigation }) => {
    const { categoryName } = route.params;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back-outline" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>{categoryName}</Text>
            <Text style={styles.description}>
                Browse the best deals and latest trends in {categoryName}!
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 20
    },
    backButton: {
        marginBottom: 15
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#333"
    },
    description: {
        fontSize: 16,
        color: "#666",
        marginTop: 10
    }
});

export default Category;
