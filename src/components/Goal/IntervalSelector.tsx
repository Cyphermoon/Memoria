import { AntDesign } from "@expo/vector-icons"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import React, { useRef, useState } from "react"
import { TouchableOpacity, View } from "react-native"
import { intervalOptions } from "settings"
import colors from "../../../colors"
import CustomBottomSheetModal from "../common/CustomBottomSheetModal"
import Text from "../common/Text"
import IntervalOption from "./IntervalOption"
import { IntervalOptionProps } from "./type"

interface Props {
	selectedInterval: IntervalOptionProps | null
	handleIntervalSelected?: (interval: IntervalOptionProps) => void
}

const IntervalSelector: React.FC<Props> = ({ selectedInterval, handleIntervalSelected }) => {
	const [snapPoints] = useState(["10%", "25%"])
	const ref = useRef<BottomSheetModal>(null)

	function openModal() {
		handleIntervalSelected && ref.current?.present()
	}

	function closeModal() {
		ref.current?.dismiss()
	}

	function _handleIntervalSelected(interval: IntervalOptionProps) {
		handleIntervalSelected && handleIntervalSelected(interval)
		closeModal()
	}

	return (
		<View>
			<TouchableOpacity className="flex-row" onPress={openModal}>
				<Text className="text-secondary mr-2">{selectedInterval?.label}</Text>
				<AntDesign name="down" size={16} color={colors.secondary} />
			</TouchableOpacity>

			{handleIntervalSelected && (
				<CustomBottomSheetModal ref={ref} snapPoints={snapPoints} index={1} text="Select Interval">
					<View className="space-y-5">
						{intervalOptions.map((interval, index) => (
							<IntervalOption
								key={index}
								label={interval.label}
								value={interval.value}
								icon={interval.icon}
								active={selectedInterval?.value === interval.value}
								handlePress={_handleIntervalSelected}
							/>
						))}
					</View>
				</CustomBottomSheetModal>
			)}
		</View>
	)
}

export default IntervalSelector
