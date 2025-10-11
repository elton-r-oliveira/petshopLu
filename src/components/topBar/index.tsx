import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    Animated,
    Dimensions,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
    const [modalVisible, setModalVisible] = useState(false);

    // simulação: tem notificações (mude para false para esconder o badge)
    const [hasNotification, setHasNotification] = useState(true);

    const slideAnim = useRef(
        new Animated.Value(-Dimensions.get("window").height)
    ).current;

    useEffect(() => {
        if (modalVisible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -Dimensions.get("window").height,
                duration: 400,
                useNativeDriver: true,
            }).start();
        }
    }, [modalVisible]);

    return (
        <View style={style.header}>
            {/* LOGO */}
            <TouchableOpacity onPress={onLogoPress}>
                <Image
                    source={require("../../assets/logo.png")}
                    style={{ width: 80, height: 80, resizeMode: "contain" }}
                />
            </TouchableOpacity>

            {/* TEXTOS */}
            <View style={style.headerText}>
                <Text style={style.hello}>Olá!</Text>
                <Text style={style.userName}>{userName || "Visitante"}</Text>
                {/* Usar o nome recebido ou "Visitante" */}
                <Text style={style.petnName}>Pet: {petName}</Text>
                <Text style={style.location}>{location}</Text>
            </View>

            {/* NOTIFICAÇÃO COM BADGE */}
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ position: "relative" }}>
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

            {/* MODAL */}
            <Modal
                transparent
                visible={modalVisible}
                animationType="none"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={style.overlay}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                >
                    <Animated.View
                        style={[
                            style.modalContent,
                            { transform: [{ translateY: slideAnim }] },
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