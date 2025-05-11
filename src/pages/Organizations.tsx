
import React, { useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTournament } from "@/contexts/TournamentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const Organizations = () => {
  const { organizations, addOrganization, participants } = useTournament();
  const [newOrgName, setNewOrgName] = useState("");
  const [newBranchName, setNewBranchName] = useState("");
  const [newSubBranchName, setNewSubBranchName] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleAddOrganization = () => {
    if (!newOrgName.trim()) {
      toast.error("Organization name cannot be empty");
      return;
    }
    
    if (organizations.some(org => org.name === newOrgName)) {
      toast.error("Organization with this name already exists");
      return;
    }
    
    const newOrg = {
      name: newOrgName,
      branches: []
    };
    
    addOrganization(newOrg);
    toast.success(`Organization "${newOrgName}" created`);
    setNewOrgName("");
    setSelectedOrg(newOrgName);
  };
  
  const handleAddBranch = () => {
    if (!newBranchName.trim() || !selectedOrg) {
      toast.error("Branch name cannot be empty and organization must be selected");
      return;
    }
    
    const orgIndex = organizations.findIndex(org => org.name === selectedOrg);
    if (orgIndex === -1) return;
    
    if (organizations[orgIndex].branches.some(branch => branch.name === newBranchName)) {
      toast.error("Branch with this name already exists in the organization");
      return;
    }
    
    const updatedOrgs = [...organizations];
    updatedOrgs[orgIndex].branches.push({
      name: newBranchName,
      subBranches: []
    });
    
    addOrganization(updatedOrgs[orgIndex]);
    toast.success(`Branch "${newBranchName}" added to "${selectedOrg}"`);
    setNewBranchName("");
    setSelectedBranch(newBranchName);
  };
  
  const handleAddSubBranch = () => {
    if (!newSubBranchName.trim() || !selectedOrg || !selectedBranch) {
      toast.error("Sub-branch name cannot be empty and both organization and branch must be selected");
      return;
    }
    
    const orgIndex = organizations.findIndex(org => org.name === selectedOrg);
    if (orgIndex === -1) return;
    
    const branchIndex = organizations[orgIndex].branches.findIndex(branch => branch.name === selectedBranch);
    if (branchIndex === -1) return;
    
    if (organizations[orgIndex].branches[branchIndex].subBranches.includes(newSubBranchName)) {
      toast.error("Sub-branch with this name already exists in the branch");
      return;
    }
    
    const updatedOrgs = [...organizations];
    updatedOrgs[orgIndex].branches[branchIndex].subBranches.push(newSubBranchName);
    
    addOrganization(updatedOrgs[orgIndex]);
    toast.success(`Sub-branch "${newSubBranchName}" added to "${selectedBranch}"`);
    setNewSubBranchName("");
    setDialogOpen(false);
  };

  const getParticipantsByOrg = (orgName: string) => {
    return participants.filter(p => p.organization === orgName);
  };
  
  const getParticipantsByBranch = (orgName: string, branchName: string) => {
    return participants.filter(p => p.organization === orgName && p.branch === branchName);
  };
  
  const getParticipantsBySubBranch = (orgName: string, branchName: string, subBranchName: string) => {
    return participants.filter(
      p => p.organization === orgName && 
           p.branch === branchName && 
           p.subBranch === subBranchName
    );
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 border-t-4 border-t-purple-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Organizations</CardTitle>
            <p className="text-gray-500">
              Manage Pencak Silat organizations, branches, and sub-branches
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col space-y-6">
              {/* Add Organization */}
              <div className="border p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Add New Organization</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Organization name"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                  />
                  <Button onClick={handleAddOrganization} className="whitespace-nowrap">
                    Add Organization
                  </Button>
                </div>
              </div>
              
              {/* Add Branch */}
              <div className="border p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Add New Branch</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <select
                    className="border rounded-md px-3 py-2"
                    value={selectedOrg}
                    onChange={(e) => setSelectedOrg(e.target.value)}
                  >
                    <option value="">Select organization</option>
                    {organizations.map((org) => (
                      <option key={org.name} value={org.name}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                  
                  <Input
                    placeholder="Branch name"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                  />
                  
                  <Button onClick={handleAddBranch}>Add Branch</Button>
                </div>
              </div>
              
              {/* Add Sub-Branch (Dialog) */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">Add New Sub-Branch</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Sub-Branch</DialogTitle>
                    <DialogDescription>
                      Add a new sub-branch to an existing branch
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-2">
                      <label className="text-sm font-medium">Organization</label>
                      <select
                        className="col-span-3 border rounded-md px-3 py-2"
                        value={selectedOrg}
                        onChange={(e) => {
                          setSelectedOrg(e.target.value);
                          setSelectedBranch("");
                        }}
                      >
                        <option value="">Select organization</option>
                        {organizations.map((org) => (
                          <option key={org.name} value={org.name}>
                            {org.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-2">
                      <label className="text-sm font-medium">Branch</label>
                      <select
                        className="col-span-3 border rounded-md px-3 py-2"
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        disabled={!selectedOrg}
                      >
                        <option value="">Select branch</option>
                        {organizations
                          .find(org => org.name === selectedOrg)
                          ?.branches.map(branch => (
                            <option key={branch.name} value={branch.name}>
                              {branch.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-2">
                      <label className="text-sm font-medium">Sub-Branch</label>
                      <Input
                        className="col-span-3"
                        placeholder="Sub-branch name"
                        value={newSubBranchName}
                        onChange={(e) => setNewSubBranchName(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddSubBranch}>
                      Add Sub-Branch
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        
        {/* Organization Structure */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Structure</CardTitle>
          </CardHeader>
          <CardContent>
            {organizations.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No organizations added yet</p>
              </div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {organizations.map((org) => {
                  const orgParticipants = getParticipantsByOrg(org.name);
                  
                  return (
                    <AccordionItem key={org.name} value={org.name}>
                      <AccordionTrigger className="hover:bg-gray-50 px-4">
                        <div className="flex items-center">
                          <span>{org.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {orgParticipants.length} participants
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-6">
                          {org.branches.map((branch) => {
                            const branchParticipants = getParticipantsByBranch(org.name, branch.name);
                            
                            return (
                              <Accordion key={branch.name} type="multiple" className="w-full border-l border-l-gray-200">
                                <AccordionItem value={`${org.name}-${branch.name}`}>
                                  <AccordionTrigger className="hover:bg-gray-50 px-4">
                                    <div className="flex items-center">
                                      <span>{branch.name}</span>
                                      <Badge variant="outline" className="ml-2">
                                        {branchParticipants.length} participants
                                      </Badge>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="pl-6 border-l border-l-gray-200">
                                      {branch.subBranches.map((subBranch) => {
                                        const subBranchParticipants = getParticipantsBySubBranch(
                                          org.name,
                                          branch.name,
                                          subBranch
                                        );
                                        
                                        return (
                                          <div key={subBranch} className="flex items-center justify-between py-2 px-4 hover:bg-gray-50 rounded-md">
                                            <span>{subBranch}</span>
                                            <Badge variant="outline">
                                              {subBranchParticipants.length} participants
                                            </Badge>
                                          </div>
                                        );
                                      })}
                                      
                                      {branch.subBranches.length === 0 && (
                                        <p className="text-gray-500 px-4 py-2">
                                          No sub-branches yet
                                        </p>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            );
                          })}
                          
                          {org.branches.length === 0 && (
                            <p className="text-gray-500 px-4 py-2">
                              No branches yet
                            </p>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Organizations;
