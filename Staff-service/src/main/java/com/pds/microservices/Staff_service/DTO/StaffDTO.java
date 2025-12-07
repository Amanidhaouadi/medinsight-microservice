package com.pds.microservices.Staff_service.DTO;

import com.pds.microservices.Staff_service.entities.StaffType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private StaffType type;
    private String specialite;
    private String numeroLicence;
    private Boolean actif;
    private LocalDateTime dateEmbauche;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String keycloakId; // nouvel attribut
}
