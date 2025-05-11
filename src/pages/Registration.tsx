
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from 'date-fns/locale';
import { cn } from "@/lib/utils";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Nama lengkap minimal 2 karakter.",
  }),
  gender: z.enum(["Laki-laki", "Perempuan"], {
    required_error: "Silakan pilih kategori gender.",
  }),
  dateOfBirth: z.date({
    required_error: "Silakan pilih tanggal lahir.",
  }),
  ageCategory: z.string({
    required_error: "Silakan pilih kategori umur.",
  }),
  weightCategory: z.string({
    required_error: "Silakan pilih kategori berat.",
  }),
  organization: z.string({
    required_error: "Silakan pilih organisasi.",
  }),
  branch: z.string({
    required_error: "Silakan pilih cabang.",
  }),
  subBranch: z.string({
    required_error: "Silakan pilih sub-cabang.",
  }),
  region: z.string().min(2, {
    message: "Daerah minimal 2 karakter.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ageCategories = [
  "Di bawah 12 tahun",
  "12-15 tahun",
  "15-18 tahun",
  "18-21 tahun",
  "21-30 tahun",
  "Di atas 30 tahun",
];

const weightCategoriesMale = [
  "Kelas A (45-50 kg)",
  "Kelas B (50-55 kg)",
  "Kelas C (55-60 kg)",
  "Kelas D (60-65 kg)",
  "Kelas E (65-70 kg)",
  "Kelas F (70-75 kg)",
  "Kelas G (75-80 kg)",
  "Kelas H (80-85 kg)",
  "Kelas I (85-90 kg)",
  "Kelas J (90+ kg)",
];

const weightCategoriesFemale = [
  "Kelas A (45-50 kg)",
  "Kelas B (50-55 kg)",
  "Kelas C (55-60 kg)",
  "Kelas D (60-65 kg)",
  "Kelas E (65-70 kg)",
  "Kelas F (70+ kg)",
];

const Registration = () => {
  const { addParticipant, organizations } = useTournament();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      gender: undefined,
      dateOfBirth: undefined,
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

  const weightCategories = selectedGender === "Laki-laki" 
    ? weightCategoriesMale 
    : selectedGender === "Perempuan" 
      ? weightCategoriesFemale 
      : [];

  function onSubmit(values: FormValues) {
    const newParticipant = {
      id: uuidv4(),
      fullName: values.fullName,
      gender: values.gender,
      dateOfBirth: format(values.dateOfBirth, 'yyyy-MM-dd'),
      ageCategory: values.ageCategory,
      weightCategory: values.weightCategory,
      organization: values.organization,
      branch: values.branch,
      subBranch: values.subBranch,
      region: values.region,
    };
    
    addParticipant(newParticipant);
    toast.success("Peserta berhasil terdaftar!");
    form.reset();
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Card className="border-t-4 border-t-red-600">
          <CardHeader>
            <CardTitle className="text-2xl">Pendaftaran Peserta</CardTitle>
            <CardDescription>
              Daftarkan peserta baru untuk turnamen
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
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama lengkap peserta" {...field} />
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
                        <FormLabel>Kategori Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis kelamin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                            <SelectItem value="Perempuan">Perempuan</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tanggal Lahir</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: id })
                                ) : (
                                  <span>Pilih tanggal</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                              locale={id}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ageCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori Umur</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kategori umur" />
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

                  <FormField
                    control={form.control}
                    name="weightCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori Berat</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!selectedGender}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedGender ? "Pilih kategori berat" : "Pilih gender dahulu"} />
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="organization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organisasi</FormLabel>
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
                              <SelectValue placeholder="Pilih organisasi" />
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
                        <FormLabel>Cabang</FormLabel>
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
                              <SelectValue placeholder={selectedOrg ? "Pilih cabang" : "Pilih organisasi dahulu"} />
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
                        <FormLabel>Sub-cabang</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!selectedBranch}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedBranch ? "Pilih sub-cabang" : "Pilih cabang dahulu"} />
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
                      <FormLabel>Daerah</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan daerah peserta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  Daftarkan Peserta
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
