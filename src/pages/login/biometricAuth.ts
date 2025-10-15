// biometricAuth.ts (Para Expo)
import * as LocalAuthentication from 'expo-local-authentication';

class BiometricAuth {
  static async isBiometricAvailable() {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      const available = hasHardware && isEnrolled;
      
      let biometryType = 'none';
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        biometryType = 'Fingerprint';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        biometryType = 'Face ID';
      }

      return { 
        available, 
        type: available ? biometryType : null 
      };
    } catch (error) {
      console.log('Erro ao verificar biometria:', error);
      return { available: false, type: null };
    }
  }

  static async authenticate() {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para entrar',
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar senha',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.log('Erro na autenticação:', error);
      return false;
    }
  }
}

export default BiometricAuth;