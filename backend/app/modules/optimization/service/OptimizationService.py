from app.modules.optimization.repository.optimizationRepo import OptimizationRepository

class OptimizationService:

    @staticmethod
    def get_most_tweeted_about_by_user():
        results, keys = OptimizationRepository.get_most_tweeted_about_by_user()
        return [dict(zip(keys, row)) for row in results]
