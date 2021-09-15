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