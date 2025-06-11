import { Label } from '../ui/label';

export const FormPlan = () => {
    return (
        <div>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
                {/* 	{errors.length > 0 && (
				<Alert variant='error' title='Error' message={errors.join(', ')} />
			)} */}
                <div className="flex flex-col gap-4">
                    <div className="space-y-6 pb-4">
                        <div>
                            <Label>Nombre</Label>
                            {/* <Controller
							control={control}
							name='name'
							render={({ field }) => (
								<Input
									{...field}
									placeholder='Nombre'
									error={!!formErrors.name}
									hint={formErrors.name?.message}
									autoComplete='off'
								/>
							)}
						/> */}
                        </div>
                        <div>
                            <Label>Descripción</Label>
                            {/* 	<Controller
							control={control}
							name='description'
							render={({ field }) => (
								<Input
									{...field}
									placeholder='Descripción'
									error={!!formErrors.description}
									hint={formErrors.description?.message}
									autoComplete='off'
								/>
							)}
						/> */}
                        </div>
                        <div>
                            <Label>Precio mensual</Label>
                            {/* <Controller
							control={control}
							name='priceMonthly'
							render={({ field }) => (
								<Input
									{...field}
									type='number'
									placeholder='Precio mensual'
									error={!!formErrors.priceMonthly}
									hint={formErrors.priceMonthly?.message}
									autoComplete='off'
								/>
							)}
						/> */}
                        </div>
                        <div>
                            <Label>Precio anual</Label>
                            {/* <Controller
							control={control}
							name='priceAnnual'
							render={({ field }) => (
								<Input
									{...field}
									type='number'
									placeholder='Precio anual'
									error={!!formErrors.priceAnnual}
									hint={formErrors.priceAnnual?.message}
									autoComplete='off'
								/>
							)}
						/> */}
                        </div>
                        <div>
                            <Label>Moneda</Label>
                            {/* <Controller
							control={control}
							name='currency'
							render={({ field }) => (
								<Input
									{...field}
									placeholder='Moneda'
									error={!!formErrors.currency}
									hint={formErrors.currency?.message}
									autoComplete='off'
								/>
							)}
						/> */}
                        </div>
                        <div className="flex items-center gap-4">
                            <div>
                                {/* <Controller
								control={control}
								name='isFree'
								render={({ field }) => (
									<Checkbox
										label='Es gratuito'
										checked={field.value}
										onChange={field.onChange}
										error={!!formErrors.isFree}
										hint={formErrors.isFree?.message}
									/>
								)}
							/> */}
                            </div>
                            <div>
                                {/* <Controller
								control={control}
								name='isPopular'
								render={({ field }) => (
									<Checkbox
										label='Es popular'
										checked={field.value}
										onChange={field.onChange}
										error={!!formErrors.isPopular}
										hint={formErrors.isPopular?.message}
									/>
								)}
							/> */}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <Label>Características</Label>
                            <div className="space-y-2">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-2">
                                        {/* 	<Input
										type='text'
										placeholder='Agregar característica'
										value={tempFeature}
										onChange={(e) => setTempFeature(e.target.value)}
										error={!!formErrors.features}
										hint={formErrors.features?.message}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												handleAddFeature();
											}
										}}
										className='w-full'
									/> */}
                                    </div>
                                    {/* 	<Button
									type='button'
									variant='outline'
									onClick={handleAddFeature}
								>
									<PlusIcon className='w-4 h-4' />
									Agregar
								</Button> */}
                                </div>
                                {/* {errorFeatures && watch('features').length === 0 && (
								<p className='text-sm text-red-500 dark:text-red-400'>
									{errorFeatures}
								</p>
							)} */}

                                {/* <DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
								modifiers={[restrictToVerticalAxis]}
							>
								<SortableContext
									items={features}
									strategy={verticalListSortingStrategy}
								>
									<div className='space-y-2'>
										{features.map((feature, index) => (
											<SortableItem
												key={feature}
												id={feature}
												feature={feature}
												index={index}
												handleRemoveFeature={handleRemoveFeature}
											/>
										))}
									</div>
								</SortableContext>
							</DndContext> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
