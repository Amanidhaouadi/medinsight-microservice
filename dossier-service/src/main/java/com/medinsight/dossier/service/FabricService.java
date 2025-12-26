package com.medinsight.dossier.service;

import org.hyperledger.fabric.gateway.*;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
//import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FabricService {

    private Gateway gateway;
    private Network consentChannel;
    private Network recordsChannel;
    private Network prescriptionChannel;

    @PostConstruct
    public void init() throws Exception {
        // Load an existing wallet holding the identity used to access the network.
        Path walletPath = Paths.get("wallet");
        Wallet wallet = Wallets.newFileSystemWallet(walletPath);

        // Path to the connection profile
        Path networkConfigPath = Paths.get("src", "main", "resources", "connection-profile.yaml");

        Gateway.Builder builder = Gateway.createBuilder();
        builder.identity(wallet, "appUser").networkConfig(networkConfigPath).discovery(true);

        // Connect to gateway
        this.gateway = builder.connect();

        // Get the networks (channels)
        this.consentChannel = gateway.getNetwork("consent-channel");
        this.recordsChannel = gateway.getNetwork("records-channel");
        this.prescriptionChannel = gateway.getNetwork("prescription-channel");

        System.out.println("Connected to Fabric Network successfully!");
    }

    // --- Consent Actions ---

    public void giveConsent(String patientID, String doctorID) throws Exception {
        Contract contract = consentChannel.getContract("consent-cc");
        contract.submitTransaction("GiveConsent", patientID, doctorID);
    }

    public boolean checkConsent(String patientID, String doctorID) throws Exception {
        Contract contract = consentChannel.getContract("consent-cc");
        byte[] result = contract.evaluateTransaction("CheckConsent", patientID, doctorID);
        return Boolean.parseBoolean(new String(result));
    }

    // --- Record Actions ---

    public void createMedicalRecord(String recordID, String content, String doctorID, String patientID)
            throws Exception {
        Contract contract = recordsChannel.getContract("records-cc");
        contract.submitTransaction("CreateRecord", recordID, content, doctorID, patientID);
    }

    public String getMedicalRecord(String recordID) throws Exception {
        Contract contract = recordsChannel.getContract("records-cc");
        byte[] result = contract.evaluateTransaction("GetRecord", recordID);
        return new String(result);
    }

    // --- Prescription Actions ---

    public void issuePrescription(String id, String content, String doctorID, String patientID) throws Exception {
        Contract contract = prescriptionChannel.getContract("prescription-cc");
        contract.submitTransaction("IssuePrescription", id, content, doctorID, patientID);
    }
}
