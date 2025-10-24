'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { mockGroups } from '@/lib/mock-data';
import { useState } from 'react';

const formSchema = z.object({
  fullName: z.string().min(3, { message: 'Tam ad ən azı 3 hərfdən ibarət olmalıdır.' }),
  group: z.string({ required_error: 'Zəhmət olmasa bir qrup seçin.' }),
});

export function AddStudentForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        // Here you would typically call an API or a server action to save the student data
        console.log('New Student Data:', values);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
            title: 'Şagird əlavə edildi',
            description: `${values.fullName} adlı şagird sistemə uğurla əlavə edildi.`,
        });

        form.reset();
        setIsLoading(false);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Yeni Şagird Əlavə Et</CardTitle>
                <CardDescription>Olimpiadaya yeni şagird əlavə etmək üçün formu doldurun.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tam Adı</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Məs: Əliyev Vəli" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="group"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qrup</FormLabel>
                                     <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Qrup seçin" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {mockGroups.map(group => (
                                                <SelectItem key={group.id} value={group.id}>
                                                    {group.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading}>
                             <PlusCircle className="mr-2" />
                            Əlavə et
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
