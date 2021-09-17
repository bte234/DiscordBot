module.exports.getIDFromPing = input => {
    if (!input) return

    // if input is ping, it would have format <@idgoeshere>
    // or <@!idgoeshere>
    if (input.startsWith('<@') && input.endsWith('>')) {
		input = input.slice(2, -1);
		if (input.startsWith('!')) {
			input = input.slice(1);
		}
		return input
	}

    // else, just assume that its already id
    return input
}

// Expects an array of args, and returns the club name, removing extra hyphens, and adding club at the end, if not already
module.exports.formatClubName = clubName => {
    // To avoid the input 'club--name' for example (Discord creates it as 'club-name')
    // This way you can't create the same club, as 'club-name' and 'club--name'

    const endName = 'club'; // Termination of the clubName (lowercase)

    const newName = clubName
        .join('-')
        .replace(/[^A-Za-z\-\s]/g, '')
        .split('-')
        ?.filter(e => e !== '')
    if (!newName?.length) return false
    
    return (
        (newName[newName.length - 1].toLowerCase() !== endName) 
        ? [...newName, endName] 
        : newName
        ).join('-').toLowerCase()
}