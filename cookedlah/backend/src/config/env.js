//centralise all environment variables in one file
import "dotenv/config"; //to use .env file

export const ENV = {
    PORT: process.env.PORT || 5001,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
};

