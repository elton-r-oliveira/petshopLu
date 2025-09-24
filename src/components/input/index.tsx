import React, { forwardRef, LegacyRef, useState } from "react";
import { View, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { style } from "./styles";
import { FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
import { themes } from "../../global/themes";

type IconComponent =
    React.ComponentType<React.ComponentProps<typeof MaterialIcons>> |
    React.ComponentType<React.ComponentProps<typeof FontAwesome>> |
    React.ComponentType<React.ComponentProps<typeof Octicons>>;

type Props = TextInputProps & {
    IconLeft?: IconComponent,
    IconRight?: IconComponent,
    IconLeftName?: string,
    IconRightName?: string,
    onIconLeftPress?: () => void,
    onIconRightPress?: () => void,
}

export const Input = forwardRef((Props: Props, ref: LegacyRef<TextInput> | null) => {
    const {
        IconLeft,
        IconRight,
        IconLeftName,
        IconRightName,
        onIconLeftPress,
        onIconRightPress,
        secureTextEntry,
        ...rest
    } = Props;

    const [isPasswordVisible, setPasswordVisible] = useState(false);

    return (
        <View style={style.boxInput}>
            {IconLeft && IconLeftName && (
                <TouchableOpacity onPress={onIconLeftPress}>
                    <IconLeft
                        name={IconLeftName as any}
                        size={20}
                        color={themes.colors.lightGray}
                        style={style.Icon}
                    />
                </TouchableOpacity>
            )}

            <TextInput
                ref={ref}
                style={style.input}
                placeholderTextColor={themes.login_cadastro.texto_input}
                cursorColor={themes.colors.bgScreen}
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                {...rest}
            />

            {IconRight && IconRightName && (
                <TouchableOpacity
                    onPress={() => {
                        if (secureTextEntry) {
                            setPasswordVisible(!isPasswordVisible);
                        }
                        if (onIconRightPress) onIconRightPress();
                    }}
                >
                    <IconRight
                        name={(secureTextEntry
                            ? isPasswordVisible
                                ? "eye"
                                : "eye-closed"
                            : IconRightName) as any}
                        size={20}
                        color={themes.login_cadastro.icone_input}
                        style={style.Icon}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
});
