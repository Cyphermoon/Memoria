import Text from "@components/common/Text";
import { GLSL, Node, Shaders, } from "gl-react";
import { Surface } from "gl-react-expo";
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider, { SliderProps } from '@react-native-community/slider';
import colors from "colors";


const shaders = Shaders.create({
    imageEffect: {
        frag: GLSL`
        precision highp float;
        varying vec2 uv;
        uniform sampler2D image;
        uniform float hue;
        uniform float saturation;
        uniform float opacity;
        uniform float brightness;
        uniform float contrast;
        
        void main() {
            vec4 color = texture2D(image, uv);
        
            // Convert to YIQ color space
            vec3 yiq = vec3(0.299, 0.587, 0.114) * color.rgb;
            float intensity = dot(yiq, vec3(1.0));
            vec3 chroma = color.rgb - vec3(intensity);
        
            // Adjust hue and saturation
            chroma = cos(hue) * chroma + sin(hue) * vec3(-chroma.b, chroma.r, chroma.g);
            color.rgb = intensity + chroma * saturation;
        
            // Adjust brightness and contrast
            color.rgb = (color.rgb - 0.5) * contrast + brightness;
        
            // Apply opacity
            color.a *= opacity;
        
            gl_FragColor = color;
        }
        `,
    },
});

const sliderProps: SliderProps = {
    minimumValue: 0,
    maximumValue: 1,
    step: 0.01,
    minimumTrackTintColor: '#FFFFFF',
    maximumTrackTintColor: 'blue',
    tapToSeek: true,
}

const EditGoalItem = () => {
    const insets = useSafeAreaInsets()
    const screenWidth = Dimensions.get('window').width

    // Editor state
    const [hue, setHue] = useState(0);
    const [saturation, setSaturation] = useState(1);
    const [opacity, setOpacity] = useState(1);
    const [brightness, setBrightness] = useState(0.5);
    const [contrast, setContrast] = useState(1);

    const sliderProps: SliderProps = {
        minimumValue: 0,
        maximumValue: 1,
        step: 0.01,
        minimumTrackTintColor: '#FFFFFF',
        maximumTrackTintColor: colors.primary[300],
        tapToSeek: true,
    }


    return (
        <ScrollView
            className='bg-primary flex-grow space-y-8 px-4'
            contentContainerStyle={styles.scrollViewContainer}
            style={{
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}>

            <Surface style={styles.surface}>
                <Node
                    shader={shaders.imageEffect}
                    uniforms={{
                        image: require('../../assets/images/glass.jpg'),
                        hue,
                        saturation,
                        opacity,
                        brightness,
                        contrast,
                    }}
                />
                <Text
                    style={{
                        position: 'absolute',
                        zIndex: 10,
                        color: 'white',
                        fontSize: 24,
                        left: 50,
                        top: 50,
                    }}
                >
                    Your text here
                </Text>
            </Surface>

            <View className="flex-grow w-full pb-10">
                <Text>Hue</Text>
                <Slider
                    style={styles.slider}
                    value={hue}
                    onValueChange={setHue}
                    {...sliderProps}

                />

                <Text>Saturation</Text>
                <Slider
                    style={styles.slider}
                    value={saturation}
                    onValueChange={setSaturation}
                    {...sliderProps}
                />

                <Text>Opacity</Text>
                <Slider
                    style={styles.slider}
                    value={opacity}
                    onValueChange={setOpacity}
                    {...sliderProps}
                />

                <Text>Brightness</Text>
                <Slider
                    style={styles.slider}
                    value={brightness}
                    onValueChange={setBrightness}
                    {...sliderProps}
                />

                <Text>Contrast</Text>
                <Slider
                    style={styles.slider}
                    value={contrast}
                    onValueChange={setContrast}
                    {...sliderProps}
                />
            </View>



        </ScrollView>
    );
};

export default EditGoalItem;

const styles = StyleSheet.create({
    surface: {
        backgroundColor: 'red',
        width: '100%',
        borderRadius: 10,
        aspectRatio: 3 / 4,
    },
    slider: {
        width: '100%',
        height: 40,
        marginBottom: 10,
    },
    scrollViewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});