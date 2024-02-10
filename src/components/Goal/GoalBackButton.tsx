import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../../../App";
import { BackButton } from "../common/BackButton";

interface Props {
    title?: string
}


type GoalScreenRouteProps = RouteProp<RootStackParamList, 'Goal'>;

export const GoalBackButton = ({ title }: Props) => {
    const navigation = useNavigation();
    const route = useRoute<GoalScreenRouteProps>();

    return (
        <BackButton title={title ? title : route.params.name} goBack={() => navigation.goBack()} />
    );
};