package com.pds.microservices.Staff_service.repositories;

import com.pds.microservices.Staff_service.entities.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StaffRepositoy extends JpaRepository<Staff, Long> {
    Optional<Staff> findByEmail(String email);

    List<Staff> findByType(String type);

    List<Staff> findByActif(Boolean actif);

    List<Staff> findByNumeroLicence(String numeroLicence);
}
