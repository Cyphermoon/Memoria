import colors from "colors"
import { BlurView } from "expo-blur"
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { FontAwesome6 } from '@expo/vector-icons'
import UserAvatar from "@components/common/UserAvatar"
import { TouchableOpacity, View } from "react-native"
import Text from "@components/common/Text"
import SortActions from "@components/Home/SortActions"
import { SortOptionProp } from "@components/Home/type"


export const HEADER_HEIGHT = 100



interface Props {
    scrollY: Animated.SharedValue<number>
    openDrawer: () => void
    navigationTitle: string
}

export const Header = ({ scrollY, openDrawer, navigationTitle }: Props) => {
    const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)
    const insets = useSafeAreaInsets()


    const headerStyle = useAnimatedStyle(() => {
        const blurIntensity = interpolate(
            scrollY.value,
            [0, HEADER_HEIGHT],
            [0, 60],
            Extrapolation.CLAMP
        );
        return {
            intensity: blurIntensity,
            backgroundColor: colors.primary.DEFAULT
        };
    });

    const contentTitleStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [50, 70], [0, 1], Extrapolation.CLAMP);
        const fontSize = interpolate(scrollY.value, [50, 70], [20, 24], Extrapolation.CLAMP);
        return {
            opacity,
            fontSize
        };
    })


    return (
        <AnimatedBlurView
            style={[
                headerStyle,
                {
                    paddingTop: insets.top,
                    height: HEADER_HEIGHT,
                    zIndex: 100,
                },
            ]}
            tint="dark"
            className='flex-row justify-between items-center absolute top-0 w-full px-3'
        >
            <TouchableOpacity onPress={() => openDrawer()} className='rotate-180'>
                <FontAwesome6 name="bars-staggered" size={26} color={colors.secondary} />
            </TouchableOpacity>
            <Animated.Text style={contentTitleStyle} className='font-medium text-secondary'>
                {navigationTitle}
            </Animated.Text>
            <UserAvatar username='Cypher_Moon' />
        </AnimatedBlurView>

    )
}


interface HeaderContentProps {
    handleSortPress: (option: SortOptionProp) => void;
    currentSortOption: SortOptionProp;
    navigationTitle: string
    marginBottom?: number
}

const HeaderContent: React.FC<HeaderContentProps> = ({ handleSortPress, currentSortOption, navigationTitle, marginBottom }) => {
    return (
        <View
            style={{
                marginBottom: marginBottom || 16,
            }}
            className='px-3'>
            <Text
                style={{ paddingTop: HEADER_HEIGHT + 20 }}
                className='font-semibold text-4xl text-secondary mb-4'>
                {navigationTitle}
            </Text>

            <SortActions
                handleSortPress={handleSortPress}
                currentOption={currentSortOption} />
        </View>
    );
};

export default HeaderContent;