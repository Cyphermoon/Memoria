import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import { BackButton } from "../common/BackButton";
import { HomeStackParamList, RootStackParamList } from "type";

interface Props {
    title?: string
}


type GoalScreenRouteProps = RouteProp<HomeStackParamList, 'Goal'>;

export const GoalBackButton = ({ title }: Props) => {
    const navigation = useNavigation();
    const route = useRoute<GoalScreenRouteProps>();

    return (
        <BackButton title={title ? title : route.params.folder.name} goBack={() => navigation.goBack()} />
    );
};