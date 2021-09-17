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
    if (!clubName?.length) return false

    // To avoid the input 'club--name' for example (Discord creates it as 'club-name')
    // This way you can't create the same club, as 'club-name' and 'club--name'
    const newName = clubName.join('-').split('-')?.filter(e => e !== '')
    
    return (
        (newName[newName.length - 1].toLowerCase() !== 'club') ? [...newName, 'club'] : newName
    ).join('-').toLowerCase()
}