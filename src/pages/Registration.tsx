
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useTournament } from "@/contexts/TournamentContext";
import MainLayout from "@/components/Layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  gender: z.enum(["Male", "Female"], {
    required_error: "Please select gender category.",
  }),
  ageCategory: z.string({
    required_error: "Please select age category.",
  }),
  weightCategory: z.string({
    required_error: "Please select weight category.",
  }),
  organization: z.string({
    required_error: "Please select an organization.",
  }),
  branch: z.string({
    required_error: "Please select a branch.",
  }),
  subBranch: z.string({
    required_error: "Please select a sub-branch.",
  }),
  region: z.string().min(2, {
    message: "Region must be at least 2 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ageCategories = [
  "Under 12",
  "12-15",
  "15-18",
  "18-21",
  "21-30",
  "Over 30",
];

const weightCategoriesMale = [
  "Class A (45-50 kg)",
  "Class B (50-55 kg)",
  "Class C (55-60 kg)",
  "Class D (60-65 kg)",
  "Class E (65-70 kg)",
  "Class F (70-75 kg)",
  "Class G (75-80 kg)",
  "Class H (80-85 kg)",
  "Class I (85-90 kg)",
  "Class J (90+ kg)",
];

const weightCategoriesFemale = [
  "Class A (45-50 kg)",
  "Class B (50-55 kg)",
  "Class C (55-60 kg)",
  "Class D (60-65 kg)",
  "Class E (65-70 kg)",
  "Class F (70+ kg)",
];

const Registration = () => {
  const { addParticipant, organizations } = useTournament();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      gender: undefined,
      ageCategory: "",
      weightCategory: "",
      organization: "",
      branch: "",
      subBranch: "",
      region: "",
    },
  });

  const selectedGender = form.watch("gender");
  const selectedOrg = form.watch("organization");
  
  // Get branches for selected organization
  const branches = organizations.find(org => org.name === selectedOrg)?.branches || [];
  
  // Get sub-branches for selected branch
  const selectedBranch = form.watch("branch");
  const subBranches = branches.find(branch => branch.name === selectedBranch)?.subBranches || [];

  const weightCategories = selectedGender === "Male" 
    ? weightCategoriesMale 
    : selectedGender === "Female" 
      ? weightCategoriesFemale 
      : [];

  function onSubmit(values: FormValues) {
    // The form validation ensures all fields are filled
    // Create new participant with required fields (non-optional)
    const newParticipant = {
      id: uuidv4(),
      fullName: values.fullName,
      gender: values.gender,
      ageCategory: values.ageCategory,
      weightCategory: values.weightCategory,
      organization: values.organization,
      branch: values.branch,
      subBranch: values.subBranch,
      region: values.region,
    };
    
    addParticipant(newParticipant);
    toast.success("Participant registered successfully!");
    form.reset();
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <Card className="border-t-4 border-t-red-600">
          <CardHeader>
            <CardTitle className="text-2xl">Participant Registration</CardTitle>
            <CardDescription>
              Register a new participant for the tournament
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter participant's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ageCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select age category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ageCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="weightCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedGender}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={selectedGender ? "Select weight category" : "Select gender first"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {weightCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="organization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("branch", "");
                            form.setValue("subBranch", "");
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select organization" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {organizations.map((org) => (
                              <SelectItem key={org.name} value={org.name}>
                                {org.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("subBranch", "");
                          }}
                          defaultValue={field.value}
                          disabled={!selectedOrg}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedOrg ? "Select branch" : "Select org first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch.name} value={branch.name}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subBranch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub-branch</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!selectedBranch}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedBranch ? "Select sub-branch" : "Select branch first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subBranches.map((subBranch) => (
                              <SelectItem key={subBranch} value={subBranch}>
                                {subBranch}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter participant's region" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  Register Participant
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Registration;
