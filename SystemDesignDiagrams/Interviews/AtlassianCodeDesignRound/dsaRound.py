
# Imagine you are the team that maintains the Atlassian employee directory. 
# At Atlassian - there are multiple groups, and each can have one or more groups. Every employee is part of a group.
# You are tasked with designing a system that could find the closest common parent group  given a target set of employees in the organization.



class Node:
    def __init__(self, name):
        self.name = name 
        self.children = {} # Node

class Employee:
    def __init__(self, rootName):
        self.root = Node(rootName)

    def getCommonClosestParentGroup(self, employees):
        ancestors = []

        for employee in employees:
            q = []
            q.append((self.root, 0))
            employee_ancestor = []
            while q:
                (node, level) = q.popleft()
                employee_ancestor.append(node)
                if node == employee:
                    break
                for children in node:
                    q.append((children, level + 1))

            ancestors.append(employee_ancestor)

    

rootOrg = "Engineering"
employeeDirectory = Employee(rootOrg)
infrastuctureNode = Node("Infrastructure")
devToolsNode = Node("DevTools")
employeeDirectory.children[infrastuctureNode.name] = infrastuctureNode
employeeDirectory.children[devToolsNode.name] = devToolsNode

employee1 = Node("E1")
employee2 = Node("E2")

employeeDirectory.getCommonClosestParentGroup(employees)




def getCommonClosestParentGroup(employees):
    # empGroups = []
    # for employee in employees:
    #     empGroups.append(employees[employee])
    
    # # empGroups = ["BitBucket", "JiraDev"]
    # ancestors = []
    # for empGroup in empGroups:
    #     ancestors.append(getAncestor(empGroup))
    pass

orgGroups = {
    "Engineering": None,
    "DevTools": "Engineering",
    "Infrastructure": "Engineering",
    "BitBucket": "DevTools",
    "JiraDev": "DevTools",
    "CloudOps": "Insfrastructure",
    "Observability": "Infrastructure"
}

employees = {
    "E1": "BitBucket",
    "E2": "JiraDev"
}

# ancestors = [["BitBucket", "DevTools", "Engineering"], ["HR", "Engineering"]]

# count = {}
# for ancestor in ancestors:
#     for group in ancestor:
#         count[group] = count.get(group, 0) + 1

# commonAncestors = []
# for (key, value) in count.items():
#     if value == len(ancestors):
#         commonAncestors.append(key)

# print(commonAncestors)







