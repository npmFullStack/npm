import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Dashboard = ({ navigation }) => {
    const posters = [
        require("./assets/poster1.png"),
        require("./assets/poster2.png"),
        require("./assets/poster3.png")
    ];

    const [currentPoster, setCurrentPoster] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        const interval = setInterval(() => {
            setCurrentPoster(prev =>
                prev === posters.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(loadingTimeout);
        };
    }, []);

    const categories = [
        {
            name: "Clothing",
            image: require("./assets/categories/clothing.png")
        },
        {
            name: "Electronics",
            image: require("./assets/categories/electronics.png")
        },
        { name: "Beauty", image: require("./assets/categories/beauty.png") },
        { name: "Home", image: require("./assets/categories/home.png") },
        { name: "Sports", image: require("./assets/categories/sports.png") },
        { name: "Toys", image: require("./assets/categories/toys.png") }
    ];

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Image
                        source={require("./assets/logo.png")}
                        style={styles.logo}
                    />
                    <View style={styles.searchBar}>
                        <Ionicons
                            name="search"
                            size={20}
                            color="#6B7280"
                            style={styles.searchIcon}
                        />
                        <TextInput
                            placeholder="Search"
                            style={styles.searchInput}
                        />
                    </View>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.productButton}>
                        <Ionicons
                            name="newspaper-outline"
                            size={26}
                            color="#fff"
                        />
                        <Text style={styles.buttonText}>Latest</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.productButton}>
                        <Ionicons name="flame-outline" size={26} color="#fff" />
                        <Text style={styles.buttonText}>Popular</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.productButton}>
                        <Ionicons
                            name="pricetags-outline"
                            size={26}
                            color="#fff"
                        />
                        <Text style={styles.buttonText}>Deals</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.sliderContainer}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#0D47A1" />
                    ) : (
                        <Image
                            source={posters[currentPoster]}
                            key={currentPoster}
                            style={styles.sliderImage}
                        />
                    )}
                </View>
                <Text style={styles.categoryTitle}>Browse by Category</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryContainer}
                >
                    {categories.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.categoryCard}
                            onPress={() =>
                                navigation.navigate("Category", {
                                    categoryName: item.name
                                })
                            }
                        >
                            <Image
                                source={item.image}
                                style={styles.categoryImage}
                            />
                            <Text style={styles.categoryText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.footerItem}
                    onPress={() => navigation.navigate("Me")}
                >
                    <Ionicons name="person-outline" size={28} color="#333" />
                    <Text style={styles.footerText}>Me</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cartIconContainer}>
                    <View style={styles.cartIcon}>
                        <Ionicons name="cart-outline" size={34} color="#fff" />
                    </View>
                    <Text style={styles.footerText}>Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.footerItem}>
                    <Ionicons
                        name="notifications-outline"
                        size={28}
                        color="#333"
                    />
                    <Text style={styles.footerText}>Notif</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: "#dcdcdc"
    },
    scrollContainer: {
        flexGrow: 1
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingTop: 50
    },
    logo: {
        width: 60,
        height: 30,
        resizeMode: "cover"
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 2,
        backgroundColor: "#fff",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 20,
        marginLeft: 10,
        flex: 1,
        paddingHorizontal: 15,
        height: 45
    },
    searchIcon: {
        marginRight: 5
    },
    searchInput: {
        flex: 1,
        fontSize: 16
    },
    body: {
        paddingTop: 0
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 0
    },
    productButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#333",
        backgroundColor: "#1e88e5",
        borderRadius: 20,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        padding: 5,
        flex: 1,
        margin: 0,
        marginHorizontal: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 120 },
        shadowRadius: 4,
        elevation: 4
    },
    buttonText: {
        marginLeft: 8,
        color: "#fff",
        fontWeight: "600",
        fontSize: 16
    },

    sliderContainer: {
        marginVertical: 0,
        alignItems: "center"
    },
    sliderImage: {
        width: "100%",
        height: 150,
        borderRadius: 12,
        resizeMode: "stretch"
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 5,
        paddingLeft: 15,
        color: "#333"
    },
    categoryContainer: {
        flexDirection: "row",
        paddingLeft: 10
    },
    categoryCard: {
        width: 80,
        maxHeight: 80,
        alignItems: "center",
        marginRight: 10,
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        padding: 10,
        elevation: 5
    },
    categoryImage: {
        width: 40,
        height: 40,
        resizeMode: "contain",
        marginBottom: 5
    },
    categoryText: {
        fontSize: 10,
        color: "#333",
        textAlign: "center",
        fontWeight: 700
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        paddingVertical: 0,
        paddingHorizontal: 10
    },
    footerItem: {
        alignItems: "center",
        flex: 1
    },
    footerText: {
        fontSize: 12,
        color: "#333",
        marginTop: 2
    },
    cartIconContainer: {
        alignItems: "center",
        justifyContent: "center",
        top: -10
    },
    cartIcon: {
        width: 60,
        height: 60,
        backgroundColor: "#1e88e5",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
        marginBottom: 2,
        borderWidth: 2,
        borderColor: "#333"
    }
});

export default Dashboard;
