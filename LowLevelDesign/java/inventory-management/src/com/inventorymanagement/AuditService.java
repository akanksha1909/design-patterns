package com.inventorymanagement;

import com.inventorymanagement.entities.Transaction;

import java.util.ArrayList;
import java.util.List;

public class AuditService {
    private static AuditService instance;
    private List<Transaction> transactionLogs = new ArrayList<>();
    private AuditService(){}
    public static AuditService getInstance() {
        if(AuditService.instance == null) {
            AuditService.instance = new AuditService();
        }
        return AuditService.instance;
    }

    public void addLog(Transaction transactionLog) {
        transactionLogs.add(transactionLog);
    }

    public List<Transaction> getLogs() {
        return this.transactionLogs;
    }

}
