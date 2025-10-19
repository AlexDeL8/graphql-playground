import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const videoGames = [
    { id: "1", title: "Sonic Adventure 2 Battle", price: 19.99, releaseYear: 2004, isOnPc: false},
    { id: "2", title: "Deep Rock Galactic", price: 29.99, releaseYear: 2018, isOnPc: true},
    { id: "3", title: "Rematch", price: 39.99, releaseYear: 2025, isOnPc: true},
    { id: "4", title: "Half Life 2", price: 9.99, releaseYear: 2004, isOnPc: true},
    { id: "5", title: "Halo 3", price: 24.99, releaseYear: 2007, isOnPc: false},
];

const typeDefs = `
    type Query {
        getVideoGames: [VideoGame]
        getVideoGameById(id: ID!): VideoGame
        getVideoGameByPrice(price: Float): [VideoGame]
    }

    type Mutation {
        createVideoGame(title: String!, price: Float!, releaseYear: Int!, isOnPc: Boolean = false): VideoGame
    }

    type VideoGame {
        id: ID!
        title: String!
        price: Float!
        releaseYear: Int!
        isOnPc: Boolean
    }
`;

const resolvers = {
    Query: {
        getVideoGames: () => {
            return videoGames;
        },
        getVideoGameById: (parent, args) => {
            return videoGames.find(game => game.id === args.id);
        }
    },
    Mutation: {
        createVideoGame: (parent, args) => {
            const { title, price, releaseYear, isOnPc } = args;
            const newVideoGame = {
                id: (videoGames.length + 1).toString(),
                title,
                price,
                releaseYear,
                isOnPc
            }
            videoGames.push(newVideoGame);
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4040 },
});

console.log(`Server running at: ${url}`);