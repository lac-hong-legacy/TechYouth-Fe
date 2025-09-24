import BirthYearScreen from '@/app/auth/login/InitProfileScreen';
import LoginScreen from '@/app/auth/login/login';
import TextloginScreen from '@/app/auth/login/TextLogin';
import SignupScreen from '@/app/auth/register';
import WelcomeScreen from '@/app/auth/welcome';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AuthStack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Textlogin" component={TextloginScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="BirthYear" component={BirthYearScreen} />
    </AuthStack.Navigator>
  );
}
