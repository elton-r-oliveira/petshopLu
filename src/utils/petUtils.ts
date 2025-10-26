export const getPetImage = (type: string) => {
    switch (type.toLowerCase()) {
        case "dog":
            return require("../assets/pets/dog.png");
        case "cat":
            return require("../assets/pets/cat.png");
        case "roedores":
            return require("../assets/pets/hamster.png");
        case "turtle":
            return require("../assets/pets/turtle.png");
        case "bird":
            return require("../assets/pets/bird.png");
        case "rabbit":
            return require("../assets/pets/rabbit.png");
        default:
            return require("../assets/pets/pet.png");
    }
};

export const getTypeLabel = (type: 'vaccine' | 'dewormer' | 'antiparasitic') => {
    switch (type) {
        case 'vaccine': return 'Vacina';
        case 'dewormer': return 'Vermífugo';
        case 'antiparasitic': return 'Antiparasitário';
        default: return 'Registro';
    }
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};