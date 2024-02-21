export function getInitials(username: string): string {
    // Find the index of the first whitespace, underscore, or hyphen character
    const sepIdx = username.search(/[\s-_]/);

    // Get the first initial and convert it to uppercase
    const fInitial = username.charAt(0).toUpperCase();

    // If a separator character is found, get the second initial and convert it to uppercase
    const lInitial = sepIdx !== -1 ? username.charAt(sepIdx + 1).toUpperCase() : "";

    // Combine the first and second initials and return the result
    return fInitial + lInitial;
}


export function getGreetings(): string {
    const hour = new Date().getHours();
    
    if (hour < 12) {
        // Return "Good morning" if the hour is before 12
        return "Good Morning";
    } else if (hour < 18) {
        // Return "Good afternoon" if the hour is between 12 and 18
        return "Good Afternoon";
    } else {
        // Return "Good evening" if the hour is after 18
        return "Good Evening";
    }
}

export function plural(count: number, word:string){
    return count === 1 ? word : word + 's';
}

export function truncateText (text: string, maxLength: number = 20) {
    // Check if the length of the text is greater than the maximum length
    if (text.length > maxLength) {
        // If so, truncate the text to the maximum length and append an ellipsis
        return text.substring(0, maxLength) + '...';
    }

    // If the text is shorter than or equal to the maximum length, return the original text
    return text;
}