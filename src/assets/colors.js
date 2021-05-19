export function getColor(colorName){
    switch(colorName){
        case "darkblue":
            return '#212e53';
        case "green":
            return '#4a919e';
        case "lightgreen":
            return '#bed3c3';
        case "pink":
            return '#ebaca2';
        case "darkpink":
            return '#ce6a6b';
        default:
            return 'black'
    }
}