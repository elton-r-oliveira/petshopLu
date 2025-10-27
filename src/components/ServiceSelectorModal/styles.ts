import { StyleSheet } from "react-native";
import { themes } from "../../global/themes";
import { Dimensions, } from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

export const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '100%',
        maxHeight: screenHeight * 0.8,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
        zIndex: 2,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: themes.colors.corTexto,
    },
    closeButton: {
        padding: 4,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginVertical: 8,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    scrollArea: {
        flexGrow: 1,
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    footerFixed: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    confirmButton: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '700',
        marginRight: 8,
    },
});