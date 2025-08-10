module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/app"],
    testMatch: [
        "**/tests/**/*.test.ts",
        "**/?(*.)+(spec|test).ts"
    ],
    transform: {
        "^.+\\.ts$": ["ts-jest", {
            tsconfig: "./tsconfig.json"
        }]
    },
    collectCoverageFrom: [
        "app/**/*.{ts,js}",
        "!app/**/*.d.ts",
        "!app/dist/**"
    ],
    moduleFileExtensions: ["ts", "js", "json", "node"],
    moduleNameMapping: {
        "^@/(.*)$": "<rootDir>/app/$1",
        "^@controllers/(.*)$": "<rootDir>/app/src/controllers/$1",
        "^@middlewares/(.*)$": "<rootDir>/app/middlewares/$1",
        "^@types/(.*)$": "<rootDir>/app/types/$1"
    }
};