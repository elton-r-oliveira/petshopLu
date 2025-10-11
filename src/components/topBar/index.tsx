import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    Animated,
    Easing
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { style } from "./styles";
import { themes } from "../../global/themes";

interface TopBarProps {
    userName: string;
    petName?: string;
    location?: string;
    onLogoPress?: () => void;
}

export default function TopBar({
    userName,
    petName = "Alfred",
    location = "São Bernardo do Campo, SP",
    onLogoPress,
}: TopBarProps) {
    const [notificationModalVisible, setNotificationModalVisible] = useState(false);
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [hasNotification] = useState(true);

    // animações separadas para cada modal
    const slideAnimUser = useRef(new Animated.Value(-300)).current;
    const slideAnimNotif = useRef(new Animated.Value(-300)).current;

    // Função de logout (ainda simulada)
    const handleLogout = () => {
        console.log("Usuário deslogado (Layout)");
        closeUserModal();
    };

    // === Animações de entrada e saída ===
    const openUserModal = () => {
        setUserModalVisible(true);
        Animated.timing(slideAnimUser, {
            toValue: 0,
            duration: 250,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    };

    const closeUserModal = () => {
        Animated.timing(slideAnimUser, {
            toValue: -300,
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }).start(() => setUserModalVisible(false));
    };

    const openNotifModal = () => {
        setNotificationModalVisible(true);
        Animated.timing(slideAnimNotif, {
            toValue: 0,
            duration: 250,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    };

    const closeNotifModal = () => {
        Animated.timing(slideAnimNotif, {
            toValue: -300,
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }).start(() => setNotificationModalVisible(false));
    };

    return (
        <View style={style.header}>
            {/* LOGO */}
            <TouchableOpacity
                onPress={() => {
                    openUserModal();
                    if (onLogoPress) onLogoPress();
                }}
            >
                <Image
                    source={require("../../assets/logo.png")}
                    style={{ width: 80, height: 80, resizeMode: "contain" }}
                />
            </TouchableOpacity>

            {/* Dados do Usuário */}
            <View style={style.headerText}>
                <Text style={style.hello}>Olá!</Text>
                <Text style={style.userName}>{userName || "Visitante"}</Text>
                <Text style={style.petnName}>Pet: {petName}</Text>
                <Text style={style.location}>{location}</Text>
            </View>

            {/* Sino */}
            <TouchableOpacity onPress={openNotifModal} style={{ position: "relative" }}>
                <Ionicons
                    name="notifications-outline"
                    size={28}
                    color={themes.colors.bgScreen}
                />
                {hasNotification && (
                    <View style={style.badge}>
                        <Text style={style.badgeText}>!</Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* MODAL USUÁRIO */}
            <Modal transparent visible={userModalVisible} animationType="none" onRequestClose={closeUserModal}>
                <TouchableOpacity
                    style={style.overlay}
                    activeOpacity={1}
                    onPressOut={closeUserModal}
                >
                    <Animated.View
                        style={[
                            style.userModalContent,
                            { transform: [{ translateY: slideAnimUser }] },
                        ]}
                    >
                        <Text style={style.titleModal}>Opções de Conta</Text>

                        <TouchableOpacity style={style.optionItem} onPress={() => { console.log("Editar Usuário"); closeUserModal(); }}>
                            <MaterialIcons name="person-outline" size={24} color={themes.colors.bgScreen} />
                            <Text style={style.optionText}>Editar nome de usuário</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={style.optionItem} onPress={() => { console.log("Editar Pet"); closeUserModal(); }}>
                            <MaterialIcons name="pets" size={24} color={themes.colors.bgScreen} />
                            <Text style={style.optionText}>Editar nome do pet</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={style.optionItem} onPress={() => { console.log("Editar Endereço"); closeUserModal(); }}>
                            <MaterialIcons name="location-on" size={24} color={themes.colors.bgScreen} />
                            <Text style={style.optionText}>Editar endereço</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={style.logoutItem} onPress={handleLogout}>
                            <MaterialIcons name="logout" size={24} color="red" />
                            <Text style={style.logoutText}>Deslogar</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>

            {/* MODAL NOTIFICAÇÕES */}
            <Modal transparent visible={notificationModalVisible} animationType="none" onRequestClose={closeNotifModal}>
                <TouchableOpacity
                    style={style.overlay}
                    activeOpacity={1}
                    onPressOut={closeNotifModal}
                >
                    <Animated.View
                        style={[
                            style.modalContent,
                            { transform: [{ translateY: slideAnimNotif }] },
                        ]}
                    >
                        <Text style={style.title}>Notificações</Text>
                        <Text style={style.item}>🔔 Você tem 1 serviço agendado para amanhã 22/09</Text>
                        <Text style={style.item}>🐶 Seu pet não tomou banho hoje, por isso fede!</Text>
                        <Text style={style.item}>💬 Promoção: Desconto especial. Consulte nossas ofertas!</Text>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
