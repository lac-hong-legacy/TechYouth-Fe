import BirthYearScreen from '@/src/screens/Auth/login/InitProfileScreen';
import LoginScreen from '@/src/screens/Auth/login/login';
import TextloginScreen from '@/src/screens/Auth/login/TextLogin';
import { default as SignupNew, default as SignupScreen } from '@/src/screens/Auth/signup/SignupNew';
import WelcomeScreen from '@/src/screens/welcome';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AuthStack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Textlogin" component={TextloginScreen} />
      <AuthStack.Screen name="TestSignup" component={SignupNew} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="BirthYear" component={BirthYearScreen} />
    </AuthStack.Navigator>
  );
}
