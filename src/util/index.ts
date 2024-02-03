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