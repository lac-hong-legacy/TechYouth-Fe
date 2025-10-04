import { Flame, Trophy } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
  currentColor: string;
  hearts: number;
  loading: boolean;
  error: string | null;
}

export const Header = ({ currentColor, hearts, loading, error }: HeaderProps) => {
  return (
    <View style={[headerStyles.header, { backgroundColor: currentColor }]}>
      <View style={headerStyles.headerStats}>
        <View style={headerStyles.leftStats}>
          <Text style={{ fontSize: 20 }}>🇻🇳</Text>
        </View>
        <View style={headerStyles.rightStats}>
          <View style={headerStyles.statItem}>
            <Flame size={17} color="#ff0000ff" fill="#f6660dff" />
            {loading && <Text style={headerStyles.statLabel}>Loading...</Text>}
            {error && <Text>{error}</Text>}
            <Text style={headerStyles.statText}>{String(hearts || 0)}</Text>
          </View>
          <View style={headerStyles.statItem}>
            <Trophy size={17} color="#ff8400ff" fill="#ff880aff" />
            <Text style={headerStyles.statText}>150</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  leftStats: {
    flexDirection: 'row',
  },
  rightStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});