import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    Animated,
    Easing,
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
}: TopBarProps) {
    const [notificationModalVisible, setNotificationModalVisible] = useState(false);
    const [hasNotification] = useState(true);

    const slideAnimNotif = useRef(new Animated.Value(-300)).current;


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
            <TouchableOpacity>
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
