import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { revenueMlForecastService } from '@/features/revenue/services/revenueMlForecastService'
import type {
  RevenueMlForecastComparisonScenario,
  RevenueMlForecastRangeDays,
  RevenueMlForecastScenarioInput,
} from '@/types/revenue.types'

export const useRevenueMlForecast = (days: RevenueMlForecastRangeDays = 30) => {
  const queryClient = useQueryClient()
  const [comparedScenarioIds, setComparedScenarioIds] = useState<string[]>(['baseline'])

  const forecastQuery = useQuery({
    queryKey: ['revenue', 'ml-forecast', days],
    queryFn: () => revenueMlForecastService.getForecast(days),
    placeholderData: keepPreviousData,
  })

  const comparisonQuery = useQuery({
    queryKey: ['revenue', 'ml-forecast', 'comparison'],
    queryFn: () => revenueMlForecastService.getComparisonScenarios(),
    staleTime: 5 * 60 * 1000, // Comparison scenarios don't change often
  })

  const simulateMutation = useMutation({
    mutationFn: (input: RevenueMlForecastScenarioInput) => revenueMlForecastService.simulateScenario(input),
    onSuccess: (newScenario) => {
      // Optimistically update the comparison list
      queryClient.setQueryData<RevenueMlForecastComparisonScenario[]>(
        ['revenue', 'ml-forecast', 'comparison'],
        (old = []) => {
          // If a scenario with the same title exists, replace it, otherwise add new
          const exists = old.findIndex(s => s.title === newScenario.title)
          if (exists > -1) {
            const updated = [...old]
            updated[exists] = newScenario
            return updated
          }
          return [...old, newScenario]
        },
      )
      // Auto select the new scenario for comparison
      setComparedScenarioIds((prev) => prev.includes(newScenario.id) ? prev : [...prev, newScenario.id])
    },
  })

  const toggleComparison = (id: string) => {
    setComparedScenarioIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const comparedScenarios = (comparisonQuery.data || []).filter((s) => comparedScenarioIds.includes(s.id))

  return {
    forecast: forecastQuery.data,
    isLoading: forecastQuery.isLoading || comparisonQuery.isLoading,
    isError: forecastQuery.isError || comparisonQuery.isError,
    allScenarios: comparisonQuery.data || [],
    comparedScenarios,
    comparedScenarioIds,
    toggleComparison,
    simulate: simulateMutation.mutate,
    isSimulating: simulateMutation.isPending,
    refetch: forecastQuery.refetch,
  }
}
