package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type Prescription struct {
	ID           string `json:"id"`
	Content      string `json:"content"`
	DoctorID     string `json:"doctorID"`
	PatientID    string `json:"patientID"`
	Status       string `json:"status"` // ISSUED, FULFILLED
	PharmacistID string `json:"pharmacistID,omitempty"`
	CreatedAt    string `json:"createdAt"`
}

func (s *SmartContract) IssuePrescription(ctx contractapi.TransactionContextInterface, id string, content string, doctorID string, patientID string) error {
	exists, err := s.PrescriptionExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("the prescription %s already exists", id)
	}

	prescription := Prescription{
		ID:        id,
		Content:   content,
		DoctorID:  doctorID,
		PatientID: patientID,
		Status:    "ISSUED",
		CreatedAt: time.Now().Format(time.RFC3339),
	}

	prescriptionJSON, err := json.Marshal(prescription)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, prescriptionJSON)
}

func (s *SmartContract) FulfillPrescription(ctx contractapi.TransactionContextInterface, id string, pharmacistID string) error {
	prescriptionJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return fmt.Errorf("failed to read from world state: %v", err)
	}
	if prescriptionJSON == nil {
		return fmt.Errorf("the prescription %s does not exist", id)
	}

	var prescription Prescription
	err = json.Unmarshal(prescriptionJSON, &prescription)
	if err != nil {
		return err
	}

	if prescription.Status == "FULFILLED" {
		return fmt.Errorf("prescription %s is already fulfilled", id)
	}

	prescription.Status = "FULFILLED"
	prescription.PharmacistID = pharmacistID

	updatedPrescriptionJSON, err := json.Marshal(prescription)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, updatedPrescriptionJSON)
}

func (s *SmartContract) GetPrescription(ctx contractapi.TransactionContextInterface, id string) (*Prescription, error) {
	prescriptionJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if prescriptionJSON == nil {
		return nil, fmt.Errorf("the prescription %s does not exist", id)
	}

	var prescription Prescription
	err = json.Unmarshal(prescriptionJSON, &prescription)
	if err != nil {
		return nil, err
	}

	return &prescription, nil
}

func (s *SmartContract) PrescriptionExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	prescriptionJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}
	return prescriptionJSON != nil, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating prescription chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting prescription chaincode: %s", err.Error())
	}
}
