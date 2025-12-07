package com.pds.microservices.Staff_service.services;

import jakarta.ws.rs.core.Response;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;

import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.springframework.stereotype.Service;
import org.keycloak.representations.idm.UserRepresentation;

import java.net.URI;
import java.util.Collections;

@Service
public class KeycloakUserService {

    private final Keycloak keycloak;

    public KeycloakUserService() {
        this.keycloak = KeycloakBuilder.builder()
                .serverUrl("http://keycloak:8080")
                .realm("microservices-realm")
                .clientId("staff-service")
                .clientSecret("TON_CLIENT_SECRET")
                .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                .build();
    }

    public String createUser(String username, String email, String password) {

        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEmail(email);
        user.setEnabled(true);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setTemporary(false);
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);

        user.setCredentials(Collections.singletonList(credential));

        Response response = keycloak.realm("microservices-realm")
                .users()
                .create(user);

        if (response.getStatus() != 201) {
            throw new RuntimeException("Erreur création user Keycloak");
        }

        String userId = extractId(response);
        return userId;
    }

    private String extractId(Response response) {
        URI location = response.getLocation();
        return location.getPath().replaceAll(".*/([^/]+)$", "$1");
    }
    public void assignRealmRoleToUser(String userId, String roleName) {

        // Récupérer le rôle depuis le realm
        RealmResource realmResource = keycloak.realm("microservices-realm");
        RoleRepresentation role = realmResource.roles().get(roleName).toRepresentation();

        // Assigner le rôle à l'utilisateur
        realmResource.users()
                .get(userId)
                .roles()
                .realmLevel()
                .add(Collections.singletonList(role));
    }

}
