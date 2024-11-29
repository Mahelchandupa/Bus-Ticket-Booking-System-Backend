const generator = require("generate-password");

const passwordGenerator = () => {
    const password = generator.generate({
        length: 8, // Length of the password
        numbers: true, // Include numbers in the password
        symbols: true, // Include symbols in the password
        uppercase: true, // Include uppercase letters in the password
        lowercase: true, // Include lowercase letters in the password
        excludeSimilarCharacters: true, // Exclude similar characters like 'o' and '0'
      });

    return password
}


module.exports = passwordGenerator