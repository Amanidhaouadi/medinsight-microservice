package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing consents
type SmartContract struct {
	contractapi.Contract
}

// Consent describes the consent structure
type Consent struct {
	PatientID string `json:"patientID"`
	DoctorID  string `json:"doctorID"`
	Active    bool   `json:"active"`
}

// GiveConsent records a consent on the ledger
func (s *SmartContract) GiveConsent(ctx contractapi.TransactionContextInterface, patientID string, doctorID string) error {
	consentKey, err := ctx.GetStub().CreateCompositeKey("consent", []string{patientID, doctorID})
	if err != nil {
		return fmt.Errorf("failed to create composite key: %v", err)
	}

	consent := Consent{
		PatientID: patientID,
		DoctorID:  doctorID,
		Active:    true,
	}

	consentJSON, err := json.Marshal(consent)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(consentKey, consentJSON)
}

// CheckConsent checks if a doctor has valid consent from a patient
func (s *SmartContract) CheckConsent(ctx contractapi.TransactionContextInterface, patientID string, doctorID string) (bool, error) {
	consentKey, err := ctx.GetStub().CreateCompositeKey("consent", []string{patientID, doctorID})
	if err != nil {
		return false, fmt.Errorf("failed to create composite key: %v", err)
	}

	consentJSON, err := ctx.GetStub().GetState(consentKey)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}
	if consentJSON == nil {
		return false, nil // No consent found
	}

	var consent Consent
	err = json.Unmarshal(consentJSON, &consent)
	if err != nil {
		return false, err
	}

	return consent.Active, nil
}

// RevokeConsent revokes a previously given consent
func (s *SmartContract) RevokeConsent(ctx contractapi.TransactionContextInterface, patientID string, doctorID string) error {
	consentKey, err := ctx.GetStub().CreateCompositeKey("consent", []string{patientID, doctorID})
	if err != nil {
		return fmt.Errorf("failed to create composite key: %v", err)
	}

	consentJSON, err := ctx.GetStub().GetState(consentKey)
	if err != nil {
		return fmt.Errorf("failed to read from world state: %v", err)
	}
	if consentJSON == nil {
		return fmt.Errorf("consent does not exist")
	}

	var consent Consent
	err = json.Unmarshal(consentJSON, &consent)
	if err != nil {
		return err
	}

	consent.Active = false

	updatedConsentJSON, err := json.Marshal(consent)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(consentKey, updatedConsentJSON)
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating consent chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting consent chaincode: %s", err.Error())
	}
}
