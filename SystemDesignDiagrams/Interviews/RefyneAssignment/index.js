let descionFlow = {
    "id": "Risk Flow Engine",
    "question": "Is credit score >= 750?",
    "condition": {
        "field": "creditScore",
        "operator": ">=",
        "value": 750
    },
    "trueBranch" : {
        "question": "Is SALARY >= 100000?",
        "condition": {
            "field": "salary",
            "operator": ">=",
            "value": 100000
        },
        "trueBranch": {
            "result": "Approved",
            "type": "PREMIUM",
            "amount": 2000000
        },
        "falseBranch": {
            "result": "Approved",
            "type": "STANDARD",
            "amount": 1000000
        }
    },
    "falseBranch": {
        "question": "Is credit score >= 650?",
        "condition": {
            "field": "creditScore",
            "operator": ">=",
            "value": 650
        },
        "trueBranch": {
            "question": "IS EMP_DURATION >= 365",
            "condition": {
                "field": "empDuration",
                "operator": ">=",
                "value": 365
            },
            "trueBranch": {
                "result": "approved",
                "type": "BASIC",
                "amount": 300000
            },
            "falseBranch": {
                "result": "rejected",
                "amount": 0
            }
        },
        "falseBranch": {
            "result": "rejected",
            "value": 0
        }
    }
}