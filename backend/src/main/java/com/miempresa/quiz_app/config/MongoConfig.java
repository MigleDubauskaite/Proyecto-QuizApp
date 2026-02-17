package com.miempresa.quiz_app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@Configuration
@EnableMongoRepositories(
    basePackages = "com.miempresa.quiz_app.repository.mongo",
    mongoTemplateRef = "mongoTemplate"
)
public class MongoConfig {

    @Bean
    public MongoClient mongoClient() {
        // Usamos la URI con usuario, contraseña y authSource
        return MongoClients.create(
            "mongodb://admin:admin123@localhost:27017/preguntas_mongo_db?authSource=admin"
        );
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), "preguntas_mongo_db");
    }
}
