import { Dimensions, useWindowDimensions } from "react-native";

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

// const { width, height } = useWindowDimensions();

// const scale = width / 400;

// export const Normal = () => {
//     const Normalize = (size) => {
//         const newSize = size * scale;
//         if (Platform.OS === 'ios') {
//             return Math.round(PixelRatio.roundToNearestPixel(newSize));
//         } else {
//             return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
//         }
//     }

// }

